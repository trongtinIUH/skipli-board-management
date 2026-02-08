import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DragDropContext } from '@hello-pangea/dnd'; 

import BoardHeader from "../components/board/BoardHeader";
import BoardList from "../components/board/BoardList";
import { getBoardById } from "../services/boardService";
import { fetchCards, createCard } from "../services/cardService";
import { fetchTasks, updateTask, deleteTask } from "../services/taskService"; 
import TaskModal from "../components/board/TaskModal";
import { connectSocket, joinBoard, leaveBoard, getSocket } from "../services/socketService";

const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [board, setBoard] = useState(null);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newListName, setNewListName] = useState('');
    const [isAddingList, setIsAddingList] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    // kết nối socket và lắng nghe event realtime
    useEffect(() => {
        const socket = connectSocket();
        
        // join vào room của board hiện tại
        joinBoard(id);

        // lắng nghe khi có task mới được tạo từ user khác
        socket.on('task-created', (newTask) => {
            console.log('Socket: task-created', newTask);
            setLists(prev => {
                return prev.map(list => {
                    if (list.id === newTask.cardId) {
                        // kiểm tra task đã tồn tại chưa tránh duplicate
                        const exists = list.tasks.find(t => t.id === newTask.id);
                        if (exists) return list;
                        return { ...list, tasks: [...list.tasks, newTask] };
                    }
                    return list;
                });
            });
        });

        // lắng nghe khi task được update (kéo thả, sửa nội dung...)
        socket.on('task-updated', (updatedTask) => {
            console.log('Socket: task-updated', updatedTask);
            setLists(prev => {
                let taskRemoved = false;
                let newLists = prev.map(list => {
                    // xóa task khỏi cột cũ nếu nó đã chuyển cột
                    const filtered = list.tasks.filter(t => {
                        if (t.id === updatedTask.id && list.id !== updatedTask.cardId) {
                            taskRemoved = true;
                            return false;
                        }
                        return true;
                    });

                    // update task nếu nằm trong cột hiện tại
                    const updated = filtered.map(t => 
                        t.id === updatedTask.id ? updatedTask : t
                    );

                    return { ...list, tasks: updated };
                });

                // nếu task đã bị xóa khỏi cột cũ -> thêm vào cột mới
                if (taskRemoved) {
                    newLists = newLists.map(list => {
                        if (list.id === updatedTask.cardId) {
                            const exists = list.tasks.find(t => t.id === updatedTask.id);
                            if (!exists) {
                                return { ...list, tasks: [...list.tasks, updatedTask] };
                            }
                        }
                        return list;
                    });
                }

                return newLists;
            });
        });

        // lắng nghe khi task bị xóa
        socket.on('task-deleted', (data) => {
            console.log('Socket: task-deleted', data);
            setLists(prev => {
                return prev.map(list => {
                    if (list.id === data.cardId) {
                        return {
                            ...list,
                            tasks: list.tasks.filter(t => t.id !== data.taskId)
                        };
                    }
                    return list;
                });
            });
        });

        // lắng nghe khi có cột mới được tạo
        socket.on('card-created', (newCard) => {
            console.log('Socket: card-created', newCard);
            setLists(prev => {
                const exists = prev.find(l => l.id === newCard.id);
                if (exists) return prev;
                return [...prev, { ...newCard, tasks: [] }];
            });
        });

        // lắng nghe khi có member mới được mời vào board
        socket.on('member-invited', (data) => {
            console.log('Socket: member-invited', data);
            toast.info(`${data.user.email} đã được thêm vào board`);
        });

        // cleanup khi unmount hoặc đổi board
        return () => {
            leaveBoard(id);
            socket.off('task-created');
            socket.off('task-updated');
            socket.off('task-deleted');
            socket.off('card-created');
            socket.off('member-invited');
        };
    }, [id]);

    const loadData = async () => {
        try {
            const [boardData, cardsData] = await Promise.all([
                getBoardById(id),
                fetchCards(id)
            ]);
            const fullLists = await Promise.all(cardsData.map(async (card) => {
                const tasks = await fetchTasks(id, card.id);
                return { ...card, tasks: tasks || [] };
            }));

            setBoard(boardData);
            setLists(fullLists);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // --- HÀM XỬ LÝ KÉO THẢ  ---
    const onDragEnd = (result) => {
        const { source, destination } = result;

        // 1. Nếu thả ra ngoài vùng cho phép -> Không làm gì
        if (!destination) return;

        // 2. Nếu thả về đúng vị trí cũ -> Không làm gì
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        // 3. Xử lý Logic di chuyển
        const newLists = [...lists];
        
        // Tìm cột nguồn và cột đích
        const sourceListIndex = newLists.findIndex(l => l.id === source.droppableId);
        const destListIndex = newLists.findIndex(l => l.id === destination.droppableId);

        const sourceList = newLists[sourceListIndex];
        const destList = newLists[destListIndex];

        // Lấy task đang bị kéo ra
        const [movedTask] = sourceList.tasks.splice(source.index, 1);

        // Chèn vào vị trí mới ở cột đích
        destList.tasks.splice(destination.index, 0, movedTask);

        // Cập nhật State ngay lập tức để giao diện mượt
        setLists(newLists);

        //update vị trí
        try {
            updateTask(id, sourceList.id, movedTask.id, { cardId: destList.id })
                .then(() => console.log("Đã lưu vị trí mới xuống DB"))
                .catch((err) => console.error("Lỗi lưu DB:", err));
        } catch (error) {
            console.error("Lỗi gọi API:", error);
        }
       
    };

            //hàm mở model task 
        const handleTaskClick = (task) => {
            setSelectedTask(task);
        };
        //hàm update task từ model 
        const handleUpdateTaskContent = async (updatedTask) => {
        try {
            // Gọi API Update
            await updateTask(id, updatedTask.cardId, updatedTask.id, {
                title: updatedTask.title,
                description: updatedTask.description,
                githubLinks: updatedTask.githubLinks || []
            });

            // Cập nhật State Local để giao diện tự đổi
            const newLists = lists.map(list => {
                if (list.id === updatedTask.cardId) {
                    return {
                        ...list,
                        tasks: list.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
                    };
                }
                return list;
            });
            setLists(newLists);
            toast.success("Đã cập nhật task!");
        } catch (error) {
            toast.error("Lỗi cập nhật task");
        }
    };


    //hàm delete task từ modal
    const handleDeleteTask = async (taskId) => {
        if (!selectedTask) return;
        try {
            // Gọi API Delete
            await deleteTask(id, selectedTask.cardId, taskId);

            // Cập nhật State Local (Xóa khỏi danh sách)
            const newLists = lists.map(list => {
                if (list.id === selectedTask.cardId) {
                    return {
                        ...list,
                        tasks: list.tasks.filter(t => t.id !== taskId)
                    };
                }
                return list;
            });
            setLists(newLists);
            toast.success("Đã xóa task!");
        } catch (error) {
            toast.error("Lỗi xóa task");
        }
    };



    // close model task
    const closeTaskModal = () => {
        setSelectedTask(null)
    };


    const handleAddList = async () => {
        if (!newListName.trim()) return;
        try {
            const newCard = await createCard(id, newListName);
            setLists([...lists, { ...newCard, tasks: [] }]);
            setNewListName('');
            setIsAddingList(false);
        } catch (error) {
            toast.error("Lỗi tạo cột");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-blue-600 text-white">Loading...</div>;

    return (
        <div className="flex flex-col h-screen" style={{ background: 'linear-gradient(135deg, #0079bf 0%, #5067c5 100%)' }}>
            <BoardHeader board={board} onCloseBoard={() => navigate('/dashboard')} />

            {/* Bọc toàn bộ vùng kéo thả bằng DragDropContext */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto p-6">
                    <div className="flex gap-6 h-full items-start">
                        {lists.map(list => (
                            <BoardList key={list.id} boardId={id} list={list} onTaskClick={handleTaskClick} />
                        ))}

                        {/* Ô thêm cột mới */}
                        <div className="w-72 flex-shrink-0">
                            {!isAddingList ? (
                                <button onClick={() => setIsAddingList(true)} className="w-full bg-white/20 hover:bg-white/30 text-white rounded-xl p-3 text-left font-bold flex items-center gap-2 transition backdrop-blur-sm">
                                    <span>+</span> Add another list
                                </button>
                            ) : (
                                <div className="bg-gray-100 p-3 rounded-xl">
                                    <input 
                                        autoFocus
                                        className="w-full p-2 border border-blue-500 rounded text-sm text-gray-900 focus:outline-none mb-2"
                                        placeholder="Enter list title..."
                                        value={newListName}
                                        onChange={(e) => setNewListName(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={handleAddList} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add List</button>
                                        <button onClick={() => setIsAddingList(false)} className="text-gray-500 px-2 py-1">✕</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DragDropContext>
            {/* Task Modal */}
           {selectedTask && (
            <TaskModal 
                task= {selectedTask}
                onClose={()=> setSelectedTask(null)}
                onUpdate={handleUpdateTaskContent}
                onDelete={handleDeleteTask}
            />
           )}
        </div>
    );
};

export default BoardDetail;
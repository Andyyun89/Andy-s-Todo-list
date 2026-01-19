import React, { useState, useRef } from 'react';
import { Plus, Trash2, Calendar, Check, X, Clock, GripVertical } from 'lucide-react';

export default function RetroTodoList() {
  // 초기 상태를 정렬된 상태로 시작 (완료된 항목이 아래로)
  const [todos, setTodos] = useState([
    { id: 1, text: "LP판 사러 가기", deadline: "2024-10-25", completed: false },
    { id: 3, text: "재즈 댄스 파티", deadline: "2024-10-31", completed: false },
    { id: 2, text: "오래된 라디오 수리", deadline: "2024-10-26", completed: true },
  ]);
  const [inputText, setInputText] = useState("");
  const [deadline, setDeadline] = useState("");

  // 드래그 앤 드롭을 위한 Ref
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newTodo = {
      id: Date.now(),
      text: inputText,
      deadline: deadline,
      completed: false
    };
    
    // 새 항목은 맨 위에 추가
    setTodos([newTodo, ...todos]);
    setInputText("");
    setDeadline("");
  };

  const toggleComplete = (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    // 체크 상태가 변경될 때만 완료된 항목을 아래로 정렬
    updatedTodos.sort((a, b) => {
      // 완료 여부가 다르면 완료된 것을 뒤로 (0: false, 1: true)
      return Number(a.completed) - Number(b.completed);
    });

    setTodos(updatedTodos);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 드래그 시작
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    // 드래그 중인 요소의 스타일을 좀 더 명확하게 하려면 클래스 추가 가능
    e.dataTransfer.effectAllowed = "move";
  };

  // 드래그 중인 항목이 다른 항목 위로 지나갈 때
  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  // 드래그 종료 (순서 변경 적용)
  const handleDragEnd = () => {
    const _todos = [...todos];
    
    // 드래그한 항목을 배열에서 꺼냄
    const draggedItemContent = _todos.splice(dragItem.current, 1)[0];
    
    // 놓은 위치에 삽입
    _todos.splice(dragOverItem.current, 0, draggedItemContent);

    dragItem.current = null;
    dragOverItem.current = null;
    setTodos(_todos);
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center font-mono text-[#4a3b2a]" style={{ backgroundColor: '#e8e4d9' }}>
      {/* Background Pattern Effect */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#d47e33 1px, transparent 1px)', 
             backgroundSize: '20px 20px' 
           }}>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Main Card */}
        <div className="bg-[#fdf6e3] rounded-lg shadow-[8px_8px_0px_0px_rgba(74,59,42,1)] border-4 border-[#4a3b2a] overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#d47e33] p-6 border-b-4 border-[#4a3b2a] flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase text-[#fdf6e3] transform -rotate-1" style={{ textShadow: '2px 2px 0px #4a3b2a' }}>
                오늘의 할 일
              </h1>
              <p className="text-[#fdf6e3] text-sm font-bold opacity-90 mt-1 tracking-widest">
                EST. 1970
              </p>
            </div>
            <div className="h-12 w-12 bg-[#2d5a52] rounded-full flex items-center justify-center border-2 border-[#fdf6e3] shadow-lg">
              <Check className="text-[#fdf6e3] w-8 h-8" />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-[#f0eadd] border-b-4 border-[#4a3b2a]">
            <form onSubmit={addTodo} className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="할 일을 입력하세요..."
                  className="w-full bg-[#fdf6e3] border-2 border-[#4a3b2a] px-4 py-3 text-lg focus:outline-none focus:ring-4 focus:ring-[#e9b876] placeholder-[#4a3b2a]/50"
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4a3b2a]">
                    <Clock size={18} />
                  </div>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-[#fdf6e3] border-2 border-[#4a3b2a] pl-10 pr-4 py-2 focus:outline-none focus:ring-4 focus:ring-[#e9b876] text-sm"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-[#2d5a52] text-[#fdf6e3] px-6 py-2 border-2 border-[#4a3b2a] font-bold hover:bg-[#234640] active:translate-y-1 transition-all flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(74,59,42,1)]"
                >
                  <Plus size={20} strokeWidth={3} /> 추가
                </button>
              </div>
            </form>
          </div>

          {/* List Area */}
          <div className="p-6 bg-[linear-gradient(transparent_23px,#d0d0d0_24px)] bg-[length:100%_24px]">
            <ul className="space-y-4">
              {todos.map((todo, index) => (
                <li 
                  key={todo.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`group relative flex items-start gap-3 p-3 transition-all duration-300 ease-in-out cursor-move border-2 border-transparent hover:border-[#e9b876]/50 rounded-lg hover:bg-[#fdf6e3]/50 ${todo.completed ? 'opacity-60' : ''}`}
                >
                  {/* Drag Handle */}
                  <div className="pt-2 text-[#4a3b2a]/40 group-hover:text-[#4a3b2a] transition-colors">
                    <GripVertical size={20} />
                  </div>

                  {/* Number Badge (현재 위치 기준) */}
                  <div className={`
                    flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#4a3b2a] font-bold text-sm z-10
                    ${todo.completed ? 'bg-[#4a3b2a] text-[#fdf6e3]' : 'bg-[#e9b876] text-[#4a3b2a]'}
                  `}>
                    {index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 relative z-10 pt-1">
                    <div className="flex justify-between items-start">
                      <span className={`text-lg font-bold leading-none transition-all duration-300 ${todo.completed ? 'line-through decoration-[#d47e33] decoration-4 text-[#4a3b2a]/60' : ''}`}>
                        {todo.text}
                      </span>
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        // Prevent drag from triggering on button click
                        onMouseDown={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 text-[#d47e33] hover:text-[#a85f20] transition-opacity ml-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    {todo.deadline && (
                      <div className="flex items-center gap-1 text-xs font-bold mt-1 text-[#4a3b2a]/70">
                        <Calendar size={12} />
                        <span>기한: {todo.deadline}</span>
                      </div>
                    )}
                  </div>

                  {/* Checkbox Action */}
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    // Prevent drag from triggering on button click
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`
                      flex-shrink-0 w-8 h-8 border-2 border-[#4a3b2a] rounded flex items-center justify-center transition-colors z-10
                      ${todo.completed ? 'bg-[#2d5a52] border-[#2d5a52]' : 'bg-[#fdf6e3] hover:bg-[#e9b876]'}
                    `}
                  >
                    {todo.completed && <Check className="text-[#fdf6e3]" size={20} strokeWidth={3} />}
                  </button>

                  {/* Retro Stamp Effect */}
                  {todo.completed && (
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none z-20 animate-in fade-in zoom-in duration-300">
                      <div className="border-4 border-[#d47e33] text-[#d47e33] px-4 py-1 text-xl font-black uppercase tracking-widest opacity-80" style={{ mixBlendMode: 'multiply', maskImage: 'url("https://www.transparenttextures.com/patterns/dust.png")' }}>
                        완료됨
                      </div>
                    </div>
                  )}
                </li>
              ))}
              
              {todos.length === 0 && (
                <li className="text-center py-8 opacity-50 italic">
                  할 일이 없네요... 재즈나 들을까요?
                </li>
              )}
            </ul>
          </div>
          
          {/* Footer tape effect */}
          <div className="h-4 bg-[#f0eadd] border-t-2 border-[#4a3b2a] flex justify-center items-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[#4a3b2a]/20"></div>
            ))}
          </div>
        </div>
        
        {/* Decorative Tape */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-[#f4d03f] opacity-80 rotate-1 shadow-sm z-20"></div>
      </div>
    </div>
  );
}
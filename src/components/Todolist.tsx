import React, { useEffect, useReducer, useState } from 'react'
import './style.css'
type Task={
    id:number,
    detail:string,
    status:boolean,
}
type State={
    list:Task[],
    task:Task,
}
type Action={
    type:any,
    payload:any,
}
function reducer(state:State,action:Action){
    switch(action.type){
        case 'changeInput':
            return {...state,task:{...state.task,detail:action.payload}}
        case 'add':
            return {...state,list:[...state.list,action.payload]}
        case 'edit':
            return {...state,list:[...action.payload]}
        case 'delete':
            return {...state,list:state.list.filter(item=>item.id!==action.payload)}
        case 'changeStatus':
            return {...state,list:state.list.map(item=>item.id===action.payload?{...item,status:!item.status}:item)}
        default:
            return state
    }
}
export default function Todolist() {
    const [listTask,setListTask]=useState<Task[]>(()=>{
        let listTaskLocal=localStorage.getItem("listTask");
        let listTask=listTaskLocal?JSON.parse(listTaskLocal):[];
        return listTask;
    })
    const initialState:State={
        list:[...listTask],
        task:{id:0,detail:'',status:false},
    }
    const [indexEdit,setIndexEdit]=useState<number>(-1);
    const [state,dispatch]=useReducer(reducer,initialState);
    //lưu dữ liệu lên local storage mỗi khi có thay đổi
    useEffect(()=>{
        localStorage.setItem("listTask",JSON.stringify(state.list))
    },[state.list])
    //ngăn load lại dữ liệu trong form
    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
    }
    //lấy dữ liệu text từ ô input và gửi action changeInput tới reducer
    const handleChangeInput=(e:React.ChangeEvent<HTMLInputElement>)=>{
        let value=e.target.value;
        dispatch({type:'changeInput',payload:value});
    }
    //gửi action add tới reducer
    const handleAddOrEdit=()=>{       
        if(indexEdit===-1){
            const newTask = { ...state.task, id: Math.floor(Math.random() * 99999999 + new Date().getMilliseconds()) };
            dispatch({ type: 'add', payload: newTask });
            dispatch({type:'changeInput',payload:''});
        }else{
            let newList=[...state.list];
            newList[indexEdit].detail=state.task.detail;
            dispatch({type:'edit',payload:newList});
            dispatch({type:'changeInput',payload:''});
            setIndexEdit(-1)
        }
    }
    //gửi action edit tới reducer
    const handleEdit=(id:number)=>{
        let index=state.list.findIndex(item=>item.id===id);
        if(index!==-1){
            dispatch({type:'changeInput',payload:state.list[index].detail});
            setIndexEdit(index);
        }    
    } 
    const handleDelete=(id:number)=>{
        dispatch({type:'delete',payload:id});
    } 
    const handleStatus=(id:number)=>{       
        dispatch({type:'changeStatus',payload:id})
    }
  return (
    <div>
      <form action="" className='form' onSubmit={handleSubmit}>
        <input type="text" onChange={handleChangeInput} value={state.task.detail} />
        <button type='submit' onClick={handleAddOrEdit}>{indexEdit !== -1?'Sửa':'Thêm'}</button>
      </form>
      <ul className='nav'>
        <li>Tất cả</li>
        <li>Đã hoàn thành</li>
        <li>Chưa hoàn thành</li>
      </ul>
      <table className='table table-striped'>
        <tbody>
        {state.list.map(item=>(
        <tr key={item.id}>
            <td><input type="checkbox" onChange={()=>handleStatus(item.id)} checked={item.status?true:false} /></td>
            <td className={item.status?'active':''}>{item.detail}</td>
            <td onClick={()=>handleDelete(item.id)}><i className="fa-solid fa-trash"></i></td>
            <td onClick={()=>handleEdit(item.id)}><i className="fa-solid fa-pen-to-square"></i></td>
        </tr>
      ))}
        </tbody>
      </table>
    </div>
  )
}

// import React, { useEffect, useReducer, useState } from 'react'
// import './style.css'

// type Task = {
//     id: number,
//     detail: string,
//     status: boolean,
// }

// type State = {
//     list: Task[],
//     task: Task,
//     indexEdit: number,
// }

// type Action = {
//     type: string,
//     payload?: any,
// }

// function reducer(state: State, action: Action) {
//     switch (action.type) {
//         case 'changeInput':
//             return { ...state, task: { ...state.task, detail: action.payload } };
//         case 'add':
//             return { ...state, list: [...state.list, action.payload] };
//         case 'edit':
//             const updatedList = [...state.list];
//             updatedList[state.indexEdit] = action.payload;
//             return { ...state, list: updatedList };
//         case 'delete':
//             return { ...state, list: state.list.filter(task => task.id !== action.payload) };
//         case 'changeStatus':
//             const updatedStatusList = state.list.map(task => 
//                 task.id === action.payload ? { ...task, status: !task.status } : task
//             );
//             return { ...state, list: updatedStatusList };
//         default:
//             return state;
//     }
// }

// export default function Todolist() {
//     const [listTask, setListTask] = useState<Task[]>(() => {
//         let listTaskLocal = localStorage.getItem("listTask");
//         let listTask = listTaskLocal ? JSON.parse(listTaskLocal) : [];
//         return listTask;
//     });

//     const initialState: State = {
//         list: [...listTask],
//         task: { id: 0, detail: '', status: false },
//         indexEdit: -1,
//     }

//     const [state, dispatch] = useReducer(reducer, initialState);

//     //lưu dữ liệu lên local storage mỗi khi có thay đổi
//     useEffect(() => {
//         localStorage.setItem("listTask", JSON.stringify(state.list));
//     }, [state.list]);

//     //ngăn load lại dữ liệu trong form
//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//     }

//     //lấy dữ liệu text từ ô input và gửi action changeInput tới reducer
//     const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//         let value = e.target.value;
//         dispatch({ type: 'changeInput', payload: value });
//     }

//     //gửi action add hoặc edit tới reducer
//     const handleAddOrEdit = () => {
//         if (state.indexEdit === -1) {
//             const newTask = { ...state.task, id: Math.floor(Math.random() * 99999999 + new Date().getMilliseconds()) };
//             dispatch({ type: 'add', payload: newTask });
//         } else {
//             const editedTask = { ...state.task };
//             dispatch({ type: 'edit', payload: editedTask });
//         }
//         dispatch({ type: 'changeInput', payload: '' });
//     }

//     //gửi action edit tới reducer
//     const handleEdit = (id: number) => {
//         const index = state.list.findIndex(item => item.id === id);
//         if (index !== -1) {
//             dispatch({ type: 'changeInput', payload: state.list[index].detail });
//             state.indexEdit = index;
//         }
//     }

//     //gửi action delete tới reducer
//     const handleDelete = (id: number) => {
//         dispatch({ type: 'delete', payload: id });
//     }

//     //gửi action changeStatus tới reducer
//     const handleChangeStatus = (id: number) => {
//         dispatch({ type: 'changeStatus', payload: id });
//     }
//    console.log(state.list);
   
//     return (
//         <div>
//             <form action="" className='form' onSubmit={handleSubmit}>
//                 <input 
//                     type="text" 
//                     onChange={handleChangeInput} 
//                     value={state.task.detail} 
//                 />
//                 <button 
//                     type='submit' 
//                     onClick={handleAddOrEdit}
//                 >
//                     {state.indexEdit !== -1 ? 'Sửa' : 'Thêm'}
//                 </button>
//             </form>
//             <ul className='nav'>
//                 <li>Tất cả</li>
//                 <li>Đã hoàn thành</li>
//                 <li>Chưa hoàn thành</li>
//             </ul>
//             <table className='table table-striped'>
//                 <tbody>
//                     {state.list.map(item => (
//                         <tr key={item.id}>
//                             <td>
//                                 <input 
//                                     type="checkbox" 
//                                     checked={item.status} 
//                                     onChange={() => handleChangeStatus(item.id)} 
//                                 />
//                             </td>
//                             <td>{item.detail}</td>
//                             <td onClick={() => handleDelete(item.id)}>
//                                 <i className="fa-solid fa-trash"></i>
//                             </td>
//                             <td onClick={() => handleEdit(item.id)}>
//                                 <i className="fa-solid fa-pen-to-square"></i>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     )
// }

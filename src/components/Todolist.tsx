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
    indexEdit:number,
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
            return {...state,list:action.payload}
        case 'delete':
            return state
        case 'changeStatus':
            return state
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
        indexEdit:-1,
    }
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
        dispatch({type:'change',payload:'value'});
    }
    //gửi action add tới reducer
    const handleAddOrEdit=()=>{
        if(state.indexEdit===-1){
            const newTask=Math.floor(Math.random()*99999999+new Date().getMilliseconds());
            dispatch({type:'add',payload:state.task});
            state.task.detail="";
        }else{
            state.list[state.indexEdit]=state.task.detail;
            state.task.detail='';
            state.indexEdit=-1;
        }
    }
    //gửi action edit tới reducer
    const handleEdit=(id:number)=>{
        state.indexEdit=state.list.findIndex(item=>item.id===id);       
    }
  return (
    <div>
      <form action="" className='form' onSubmit={handleSubmit}>
        <input type="text" onChange={handleChangeInput} value={state.indexEdit===-1?state.task.detail:state.list[state.indexEdit].detail} />
        <button type='submit' onClick={handleAddOrEdit}>{state.indexEdit !== -1?'Sửa':'Thêm'}</button>
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
            <td><input type="checkbox" /></td>
            <td>{item.detail}</td>
            <td><i className="fa-solid fa-trash"></i></td>
            <td onClick={()=>handleEdit(item.id)}><i className="fa-solid fa-pen-to-square"></i></td>
        </tr>
      ))}
        </tbody>
      </table>
    </div>
  )
}


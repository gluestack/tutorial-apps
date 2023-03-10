import React from "react";
import SideBar from "./SideBar";
import {
  InsertTodoMutationVariables,
  useInsertTodoMutation,
} from "../services/__generated__";
import { useData } from "../context/data";

const InputBox = () => {
  const [title, setTitle] = React.useState("");
  const { addTodo }: any = useData();

  const [insertData, { loading, error }] = useInsertTodoMutation();

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim()) {
      const newTodo: InsertTodoMutationVariables = {
        title: title,
        is_completed: false,
      };

      try {
        const { data } = await insertData({ variables: newTodo });
        addTodo(data?.insert_todos?.returning[0]);
        setTitle("");
      } catch (error: any) {
        //
      }
    }
  };

  return (
    <div className="flex h-20 px-3 border-b">
      <SideBar />
      <form onSubmit={handlerSubmit} className="h-full flex-1">
        <input
          type="text"
          placeholder="What needs to be done?"
          className="placeholder:italic font-thin pl-4 pr-3 w-full h-full text-3xl outline-none tracking-wider bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </div>
  );
};

export default InputBox;

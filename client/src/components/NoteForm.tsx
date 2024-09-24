/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../App";

const NoteForm = () => {
	const [newNote, setNewNote] = useState("");
	

    const queryClient = useQueryClient();

	const {mutate:createNote,isPending:isCreating}= useMutation({
        mutationKey:['createNote'],
        mutationFn:async(e:React.FormEvent)=>{
            e.preventDefault()

            try{
                const res = await fetch(BASE_URL + `/notes`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({body: newNote}),
                })

                const data = await res.json();

                if (!res.ok){
                    throw new Error(data.error || "Something went wrong")
                }

                setNewNote("");
                return data;
            }catch (error:any){
                throw new Error(error)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"]});
        },

        onError: (error:any) => {
            alert(error.message);
        }
    })

	return (
		<form onSubmit={createNote}>
			<Flex gap={2}>
				<Input
					type='text'
					value={newNote}
					onChange={(e) => setNewNote(e.target.value)}
					ref={(input) => input && input.focus()}
				/>
				<Button
					mx={2}
					type='submit'
					_active={{
						transform: "scale(.97)",
					}}
				>
					{isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
				</Button>
			</Flex>
		</form>
	);
};
export default NoteForm;

// STARTER CODE:

// import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
// import { useState } from "react";
// import { IoMdAdd } from "react-icons/io";

// const TodoForm = () => {
// 	const [newTodo, setNewTodo] = useState("");
// 	const [isPending, setIsPending] = useState(false);

// 	const createTodo = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		alert("Todo added!");
// 	};
// 	return (
// 		<form onSubmit={createTodo}>
// 			<Flex gap={2}>
// 				<Input
// 					type='text'
// 					value={newTodo}
// 					onChange={(e) => setNewTodo(e.target.value)}
// 					ref={(input) => input && input.focus()}
// 				/>
// 				<Button
// 					mx={2}
// 					type='submit'
// 					_active={{
// 						transform: "scale(.97)",
// 					}}
// 				>
// 					{isPending ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
// 				</Button>
// 			</Flex>
// 		</form>
// 	);
// };
// export default TodoForm;
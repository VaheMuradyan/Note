import { Flex, Spinner, Stack, Text} from "@chakra-ui/react";
import NoteItem from "./NoteItem";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";


export type Note = {
    _id: number;
    body: string;
};
const NoteList = () => {
	const {data:notes, isLoading} = useQuery<Note[]>({
        queryKey:["notes"],
        queryFn: async () => {
            try{
                const res = await fetch(BASE_URL + "/notes");
                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.error || "Something went wrong")
                }

                return data || []
            }catch(error){
                console.log(error)
            }
        }
    })
	return (
		<>
			<Text fontSize={"4xl"} textTransform={"uppercase"} fontWeight={"bold"} textAlign={"center"} my={2}
            bgGradient="linear(to-l, #0b85f8, #00ffff)" 
            bgClip="text"
            >
			  Notes List
			</Text>
			{isLoading && (
				<Flex justifyContent={"center"} my={4}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{!isLoading && notes?.length === 0 && (
				<Stack alignItems={"center"} gap='3'>
					<Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
                        You don't have notes! 🤞
					</Text>
					<img src='/go.png' alt='Go logo' width={70} height={70} />
				</Stack>
			)}
			<Stack gap={3}>
				{notes?.map((note) => (
					<NoteItem key={note._id} note={note} />
				))}
			</Stack>
		</>
	);
};
export default NoteList;
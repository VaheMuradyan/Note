import {Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { Note } from "./NoteList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";

const NoteItem = ({ note }: { note: Note }) => {
    const queryClient = useQueryClient();

    const {mutate: deleteNote, isPending: isDeleting } = useMutation({
        mutationKey: ["deleteNote"],
        mutationFn: async () => {
            try{
                const res = await fetch(BASE_URL + `/notes/${note._id}`,{
                    method: "DELETE",
                });
                const data = await res.json();
                if (!res.ok){
                    throw new Error(data.error || "Something went wrong");
                }
                return data;
            }catch(error){
                console.log(error);
            }
        },

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["notes"]});
        },
    });

	return (
		<Flex gap={2} alignItems={"center"}>
			<Flex
				flex={1}
				alignItems={"center"}
				border={"1px"}
				borderColor={"gray.600"}
				p={2}
				borderRadius={"lg"}
				justifyContent={"space-between"}
			>
				<Text
					color={"green.200"}				
				>
					{note.body}
				</Text>
			</Flex>
			<Flex gap={2} alignItems={"center"}>
				<Box color={"red.500"} cursor={"pointer"}onClick={() => deleteNote()}>
					{!isDeleting && <MdDelete size={25} />}
					{isDeleting && <Spinner size={"sm"} />}
				</Box>
			</Flex>
		</Flex>
	);
};
export default NoteItem;
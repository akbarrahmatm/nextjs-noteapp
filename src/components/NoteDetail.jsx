import { createNotes, getNoteById } from "@/services/notes.service";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormHelperText,
  Spinner,
  Card,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  CardBody,
  Text,
  ButtonGroup,
} from "@chakra-ui/react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Bounce } from "react-toastify";
import Swal from "sweetalert2";
import ErrorMessage from "./ErrorMessage";
import dayjs from "dayjs";

export default function NoteDetail() {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [note, setNote] = useState();

  const fetchNoteDetail = async () => {
    setIsLoading(true);
    try {
      const response = await getNoteById(params.id);

      if (!response || !response.data || !response.data.note) {
        throw new Error("Note not found. Please check the ID and try again.");
      }

      setNote(response.data.note);
    } catch (err) {
      setError(err.message);

      toast.error(err.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNoteDetail();
  }, []);

  const handleClickEdit = (id) => {
    if (id) {
      router.push(`/edit/${id}`);
    } else {
      Swal.fire({
        title: "Oooppsss",
        icon: "question",
        iconColor: "red",
        text: "An error occured",
      });
    }
  };

  return (
    <>
      <Box width={{ base: "100%", md: "70%", lg: "50%" }} m="auto">
        {isLoading === false && error && <ErrorMessage errorMessage={error} />}

        <Card>
          <CardHeader>
            <Heading size="md">
              {note && note.title && note.title} {isLoading && "-"}
            </Heading>
            {!isLoading && note && (
              <Box mt={2}>
                <ButtonGroup display={"flex"} justifyContent="flex-end">
                  <Button
                    onClick={() => handleClickEdit(note.id)}
                    colorScheme={"yellow"}
                    size="sm"
                  >
                    Edit
                  </Button>
                </ButtonGroup>
              </Box>
            )}
          </CardHeader>

          <CardBody>
            <Box>
              <Heading size="xs">
                ID : {note && note.id && note.id} {isLoading && "-"} |{" "}
                {note &&
                  note.createdAt &&
                  dayjs(note.createdAt).format(
                    "dddd, DD MMMM YYYY HH:mm:ss"
                  )}{" "}
                {isLoading && "-"}
              </Heading>
              <Text pt="2" fontSize="sm">
                {note && note.body && note.body} {isLoading && "-"}
              </Text>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </>
  );
}

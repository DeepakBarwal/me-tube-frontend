import styled from "styled-components";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border: none;
  border-radius: 3px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const Comments = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/comments/${videoId}`);
        setComments(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
  }, [videoId]);

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/comments`,
        {
          content: newComment,
        },
        {
          params: {
            modelType: "Video",
            modelId: videoId,
          },
        }
      );
      setComments([...comments, res.data.data]);
      setNewComment("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser.img} />
        <Input
          placeholder="Add a comment..."
          onChange={(e) => setNewComment(e.target.value)}
          value={newComment}
        />
        <Button onClick={addComment}>Post</Button>
      </NewComment>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;

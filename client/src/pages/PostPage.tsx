import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components"; // Import a CSS-in-JS library
import { Markup } from 'interweave';
import { Post } from "../types/types";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const PostTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  max-height: 500px;
  overflow-y: auto;
`;

const SubCategory = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
`;

const PostImage = styled.img`
  width: 100px;
  height: 120px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 18px;
`;
const DescriptionContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  max-height: 500px;
  overflow-y: auto;
`;

function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/post/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);
  return (
    <Container>
      {post ? (
        <>
          <PostTitle>{post.title}</PostTitle>
          <SubCategory>
            {post.categoryName}
          </SubCategory>
          <SubCategory>
            {post.subCategoryName}
          </SubCategory>
          <PostImage src={post.image} alt={post.title} />
        </>
      ) : (
        <LoadingMessage>Loading...</LoadingMessage>
      )}

      <DescriptionContainer>
        <p>
          <Markup content={post?.body} />
        </p>
      </DescriptionContainer>
    </Container>
  );
}

export default PostPage;

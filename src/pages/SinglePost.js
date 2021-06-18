import React,{useContext,useState,useRef} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment'
import {AuthContext} from '../context/auth'

import {
    Button,
    Card,
    Grid,
    Image,
    Icon,
    Label,
    Form
  } from 'semantic-ui-react';
import DeleteButton from '../components/DeleteButton'
import LikeButton from '../components/LikeButton';

function SinglePost(props){

    const postId = props.match.params.postId;
    console.log("postId",postId)
    const {user} = useContext(AuthContext)
    const commentInputRef = useRef(null);
    const [comment, setComment] = useState('');
    
    const {data: { getPost }={}} = useQuery(FETCH_POST_QUERY, {
        variables: {
          postId
        }
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
          setComment('');
        commentInputRef.current.blur();
        },
        variables: {
          postId,
          body: comment
        }
      });

    function deletePostCallback(){
        props.history.push('/')
    }

    let postMarkup;
    if (!getPost) {
        postMarkup = <p>Loading post..</p>;
    } else {
        const {
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount
            } = getPost;

            postMarkup = (
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Image
                            src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                            size="small"
                            float="right"
                            />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content>
                                <LikeButton user={user} post={{id,likes,likeCount}}/>
                                <Button as="div" labelPosition="right" onClick={()=>console.log('comment itttt')}>
                                    <Button basic color="blue">
                                        <Icon name="comments"/>
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                {
                                    user && user.username === username && (
                                        <DeleteButton postId={id} callback={deletePostCallback}/> 
                                    )    
                                }
                            </Card.Content>
                            </Card>
                            {
                                user && (
                                    <Card fluid>
                                        <Card.Content>
                                        <p>post a comment</p>
                                        <Form>
                                            <div className="ui action input fluid">
                                                <input type="text"
                                                placeholder="comment.."
                                                name="comment"
                                                value={comment}
                                                onChange={event=> setComment(event.target.value)}
                                                ref={commentInputRef}
                                                 />
                                                 <button type="submit" className="ui button teal" disabled={comment.trim()===''}
                                                 onClick={submitComment}>
                                                     submit
                                                 </button>
                                            </div>
                                        </Form>

                                        </Card.Content>   
                                    </Card>
                                )
                            }
                            {
                                comments.map(comment=>(
                                    <Card fluid key={comment.id}>
                                        <Card.Content>
                                        {user && user.username === comment.username && (
                                                <DeleteButton postId={id} commentId={comment.id} />
                                            )}
                                            <Card.Header>{comment.username}</Card.Header>
                                            <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                            <Card.Description>{comment.body}</Card.Description>
                                        </Card.Content>
                                    </Card>
                                ))
                            }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )


    }
return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId:$postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`
export default SinglePost;
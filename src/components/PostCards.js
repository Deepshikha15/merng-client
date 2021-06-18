import React,{useContext} from 'react'
import {Button,Card,Icon,Label ,Image} from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import {AuthContext} from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import MyPopup from '../util/MyPopup'

export default function PostCards({post: {body,createdAt,id,username,likes,likeCount,commentCount}}) {

    const {user} = useContext(AuthContext)


    return (
    <Card>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>
         {body}
        </Card.Description>
      </Card.Content>
      <Card.Content>
          
    <LikeButton user={user} post={{id,likes,likeCount}}/>
    <MyPopup content="comment on post 🐮"  >
    <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                <Button color='teal' basic>
                    <Icon name='comments' />
                </Button>
                <Label basic color='teal' pointing='left'>
                    {commentCount}
                </Label>
            </Button>
        </MyPopup> 

    {
        user&& user.username === username && <DeleteButton postId={id} />
            
    }
      
      </Card.Content>
    </Card>
    )
}

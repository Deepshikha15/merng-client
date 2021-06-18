import React,{useContext} from 'react'
import {useQuery} from '@apollo/react-hooks'
// import gql from 'graphql-tag'
import {Grid,Transition} from 'semantic-ui-react'
import PostCard from '../components/PostCards'
import '../App.css'
import {AuthContext} from '../context/auth'
import PostForm from '../components/PostForm'
import { FETCH_POSTS_QUERY } from '../util/graphql';

function Home() {
    const {user} = useContext(AuthContext)
    const {
        loading,
        data: { getPosts: posts }={}
      } = useQuery(FETCH_POSTS_QUERY);
    return (
        <Grid columns={3} divided>
            <Grid.Row className="page-title">
                <h1>Recent Posts on SocialApe</h1>
            </Grid.Row>
            <Grid.Row>
                {
                    user&&(
                        <Grid.Column>
                            <PostForm/>
                        </Grid.Column>
                    )
                }
            </Grid.Row>
        <Grid.Row>
            {loading ? (<h1>Loading process...</h1>):(
                <Transition.Group>
                    {
                    posts&&posts.map(post=>(
                    <Grid.Column key={post.id} style={{marginBottom:20}}>
                        <PostCard post={post}/>
                    </Grid.Column>
                ))}
                    </Transition.Group>
            )}
        
        </Grid.Row>
        </Grid>
    )
}


export default Home;
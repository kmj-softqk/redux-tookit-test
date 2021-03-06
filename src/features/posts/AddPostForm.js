import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPost } from './postsSlice';

const AddPostForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userId, setUserId] = useState('');
    const [addRedquestStatus, setAddRequestStatus] = useState('idle');

    const dispatch = useDispatch();
    const users = useSelector((state) => state.users);

    const onTitleChanged = (e) => setTitle(e.target.value);
    const onContentChanged = (e) => setContent(e.target.value);
    const onAuthorChanged = (e) => setUserId(e.target.value);

    const canSave =
        [title, content, userId].every(Boolean) && addRedquestStatus === 'idle';

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending');
                const resultAction = await dispatch(
                    addNewPost({ title, content, user: userId }),
                );
                unwrapResult(resultAction);
                setTitle('');
                setContent('');
                setUserId('');
            } catch (err) {
                console.error('Failed to save the post : ', err);
            } finally {
                setAddRequestStatus('idle');
            }
        }
    };

    const usersOptions = users.map((user) => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ));
    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <lable htmlFor="postTitle">Post Title:</lable>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    placeholder="what's on your mind?"
                    value={title}
                    onChange={onTitleChanged}
                />
                <lable htmlFor="postAuthor">Author:</lable>
                <select
                    id="postAuthor"
                    value={userId}
                    onChange={onAuthorChanged}
                >
                    <option value=""></option>
                    {usersOptions}
                </select>
                <lable htmlFor="postContent">Content:</lable>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>
            </form>
        </section>
    );
};

export default AddPostForm;

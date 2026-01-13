import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomeFeed } from '../features/home/homeFeedSlice';

export const useHomeFeed = () => {
  const dispatch = useDispatch();
  const { listings, status, error } = useSelector((s) => s.homeFeed);

  useEffect(() => {
    dispatch(fetchHomeFeed());
  }, [dispatch]);

  return { listings, status, error, refetch: () => dispatch(fetchHomeFeed()) };
};
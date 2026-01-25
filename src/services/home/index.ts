import {useTokenStore} from '../../store/auth';
import axios from '../../config/axios-tias';

// import { useTokenStore } from '@/store/auth'

export type LoginResponse = {
  message?: string;
  data?: object;
};

export async function getEvent(): Promise<LoginResponse> {
  const token = useTokenStore.getState().token;
  const response = await axios.get('berita/active-event', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: token,
    },
  });
  return response.data;
}
export async function getTantangan(): Promise<LoginResponse> {
  const token = useTokenStore.getState().token;
  const response = await axios.get('berita/active-tantangan', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: token,
    },
  });
  return response.data;
}
export async function getVotingQuesting(): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axios.get('voting/question', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: token,
    },
  });
  return response.data;
}
export async function getVotingDosen(id: number): Promise<any> {
  const token = useTokenStore.getState().token;
  const response = await axios.get(`voting/question/${id}`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: token,
    },
  });
  return response.data;
}

export async function postVote(data: any): Promise<LoginResponse> {
  const token = useTokenStore.getState().token;
  const response = await axios.post('voting/result', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      token: token,
    },
  });
  return response.data;
}

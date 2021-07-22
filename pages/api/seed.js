import {supabase} from '../../utils/supabase.js';

const payload = [
  {
    id: 'vp9qun4dpe8',
    sender: 'Denny',
    text: 'Dog',
    description: 'A fruit',
    lat: 21.28477414273057,
    lng: -157.78964581279698,
    ord: 1,
    version: '1',
    created_at: '2021-07-21T05:12:42.401Z',
    updated_at: '2021-07-21T05:12:42.401Z'
  },
  {
    id: 'fu1ofrpbado',
    sender: 'Denny',
    text: 'Cat',
    description: 'A fruit',
    lat: 21.286702313337127,
    lng: -157.7942055681223,
    ord: 2,
    version: '2',
    created_at: '2021-07-21T05:20:28.560Z',
    updated_at: '2021-07-21T05:20:28.560Z'
  }
]

export default async (_, res) => {
  try {
    await supabase
      .from('pin')
      .upsert(payload)
      .then(resp => {
        console.log('resp', resp)
      })
  } catch (error) {
    console.error(error)
  }

  res.send('ok');
}
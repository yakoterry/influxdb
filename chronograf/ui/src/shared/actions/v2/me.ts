import {getMe as getMeAPI} from 'src/shared/apis/v2/user'

export enum ActionTypes {
  SetMe = 'SET_ME',
}

export interface SetMe {
  type: ActionTypes.SetMe
  payload: {
    me: {
      id: string
      name: string
    }
  }
}

export type Actions = SetMe

export const setMe = me => ({
  type: ActionTypes.SetMe,
  payload: {
    me,
  },
})

export const getMe = () => async (dispatch, getState) => {
  try {
    const {
      links: {me: url},
    } = await getState()

    const user = await getMeAPI(url)

    dispatch(setMe(user))
  } catch (e) {
    console.error(e)
  }
}

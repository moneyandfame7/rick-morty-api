import axios from 'axios'
import { fillArray } from './fill-array'

export const fetchData = async <T>(url: string): Promise<Array<T>> => {
  const response = await axios.get(url)
  const countOfObjects = response.data.info.count
  const arr = fillArray(countOfObjects)
  try {
    const response = await axios.get(`${url}/${arr}`)
    // console.log(response.data);

    return response.data
  } catch (err) {
    throw err
  }
}

export const fetchObject = async <T>(url: string): Promise<T> => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (e) {
    console.log(e)
  }
}

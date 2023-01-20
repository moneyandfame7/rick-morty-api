import axios from 'axios'
import { fillArray } from './fill-array'

export const fetchData = async <T>(url: string): Promise<Array<T>> => {
  const response = await axios.get(url)
  const countOfObjects = response.data.info.count
  const arr = fillArray(countOfObjects)
  try {
    const { data } = await axios.get(`${url}/${arr}`)

    return data
  } catch (err) {
    throw err
  }
}

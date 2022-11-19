import moment from 'moment'
import dayjs from 'dayjs'
const TestPage = () => {
  const d1 = Date()
  const iso = dayjs(d1).toISOString()

  const m1 = moment('2022-11-1')
  const m2 = moment('2022-11-9')
  //   console.log(moment(d1))
  //   console.log(dayjs(d1).toISOString())
  console.log(m2.diff(m1, 'days'))

  return <div>{1}</div>
}

export default TestPage

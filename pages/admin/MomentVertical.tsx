import { Moment } from 'moment'

export default function MomentVertical({ mm }: { mm: Moment }) {
  const year = mm.year()
  const month = mm.month()
  const day = mm.date()
  return (
    <div style={{ fontSize: 10, width: 30, textAlign: 'center' }}>
      {/* <div>{year}</div> */}
      <div>
        {month}-{day}
      </div>
      {/* <div>{day}</div> */}
    </div>
  )
}

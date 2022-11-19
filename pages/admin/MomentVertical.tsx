import { Moment } from 'moment'
import styled from 'styled-components'

const VerticalBar = styled.div`
  height: 5px;
  width: 1px;
  background-color: white;
  margin: 0 auto;
`

export default function MomentVertical({ mm }: { mm: Moment }) {
  const year = mm.year()
  const month = mm.month()
  const day = mm.date()
  return (
    <div
      style={{
        fontSize: 12,
        width: 36,
        textAlign: 'center'
      }}
    >
      {/* <div>{year}</div> */}
      {/* <div>{month}</div>
      <VerticalBar></VerticalBar>
      <div>{day}</div> */}
      {`${month}-${day}`}
    </div>
  )
}

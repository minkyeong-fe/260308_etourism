interface PriceDetailProps {
  breakdown: {
    stay: number
    breakfast: number
    extraBed: number
  }
  total: number
}

function formatWon(n: number): string {
  return `₩${n.toLocaleString()}`
}

export function PriceDetail({ breakdown, total }: PriceDetailProps) {
  return (
    <table>
      <tbody>
        <tr>
          <td>숙박</td>
          <td>{formatWon(breakdown.stay)}</td>
        </tr>
        <tr>
          <td>조식</td>
          <td>{formatWon(breakdown.breakfast)}</td>
        </tr>
        <tr>
          <td>엑스트라베드</td>
          <td>{formatWon(breakdown.extraBed)}</td>
        </tr>
        <tr>
          <td><strong>합계</strong></td>
          <td><strong>{formatWon(total)}</strong></td>
        </tr>
      </tbody>
    </table>
  )
}

// 차트 API 응답 타입
export interface ChartApiResponse<T> {
  success: boolean
  message: string
  data: T
}

import Method from '@/types/Method'
import Cell from '@/models/Cell'

type ExecutedMethodsData = {
  [K in Method]: Array<Cell>
}

export default ExecutedMethodsData

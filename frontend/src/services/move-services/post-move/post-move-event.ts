import { BoardCell } from '@models/cell.model';
import { MoveExecutorService } from '../move-executor.service';

export abstract class PostMoveEvent {
  protected static moveExecutor: MoveExecutorService;

  static setMoveExecutor(executor: MoveExecutorService) {
    this.moveExecutor = executor;
  }

  abstract trigger(): EventResult;
}

type EventResult = {
  success: boolean;
  board: BoardCell[][];
};

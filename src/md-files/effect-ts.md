## Effect.succeed()

## Effect.fail()

## 同步：Effect.sync和Effect.try

## 异步：
  # Effect.promise
  # Effect.tryPromise()
  # Effect.async<Buffer, Error>()
     resume(Effect.succeed/Effect.fail) 中断时执行的函数

## 暂停：Effect.suspend(()=>effect): 一个效果依赖于另一个效果


## 组合函数: Effect.zipwith(Effect.suspend(),Effect.suspend())

## 执行：
  # 同步
  # Effect.runSync()
  # Effect.runSyncExit()    查明效果是否成功或失败

  # 异步
  # Effect.runPromise()     返回Promise
  # Effect.runPromiseExit()
  # Effect.runFork()

## Effect.gen()

##  转换 Effect（处理结果）
  #  pipe: 每个函数的结果将成为下一个函数的输入，并返回最终结果
  #  flatMap: 链式执行 Effect（前一个结果作为后一个输入）
  #  map: 转换效果内的值
  #  tap: 执行副作用但不改变结果（如日志）

##  并发与顺序
  #  all：顺序执行多个 Effect，返回结果数组
  #  allPar：	并行执行多个 Effect（更高效）
  #  race:多个 Effect 竞赛，取第一个完成的结果
  #  andThen:忽略前一个 Effect 的结果，执行后一个

##  资源管理（安全释放）
  #  acquireRelease： 先获取资源（acquire），后自动释放（release）

## 使用工具（重试、超时）
  #  retry: 失败时重试（可配置次数 / 策略）
  #  timeout: 超时控制（超过时间则失败）
  #  interruptible: 标记为可中断（配合 Fiber 中断执行）

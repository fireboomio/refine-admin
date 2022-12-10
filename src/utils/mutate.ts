export function mutateToPromise(mutate: (args: any, options: any) => any) {
  return (args: any) => {
    return new Promise((resolve, reject) => {
      mutate(args, {
        onSuccess: () => {
          console.log(11)
          resolve()
        },
        onError: () => {
          console.error(22)
          reject()
        }
      })
    })
  }
}
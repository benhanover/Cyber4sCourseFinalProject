export const getPeerId = async (mypeer: any) => {
  return new Promise((reject, resolve) => {
    mypeer.on('open', async (id: any) => {
      resolve(id);
    })
  })
}


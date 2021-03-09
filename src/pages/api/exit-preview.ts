import { NextApiRequest, NextApiResponse } from 'next'

const exitPreview = async(req: NextApiRequest, res:NextApiResponse) => {
  res.clearPreviewData()
  res.writeHead(307, { Location: '/' })
  res.end()
}

export default exitPreview

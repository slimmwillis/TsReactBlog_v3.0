import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar"

export interface Post {
  _id: string
  title: string
  body: string
  category: string
  subCategory: string
  subCategoryName: string
  image?: string
  categoryName?:string
}

export interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

export interface ErrorType {
  message: string
  response?: {
    data?: string
  }
}

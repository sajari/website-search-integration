declare module "dlv" {
  export default function dlv<T = any>(obj: any, key: string, initial?: any): T;
}

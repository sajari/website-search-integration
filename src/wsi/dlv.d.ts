declare module "dlv" {
  export default function dlv(
    obj: { [k: string]: any },
    key: string,
    def?: any
  ): any;
}

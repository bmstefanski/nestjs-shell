const marker = Symbol()

export abstract class ShellComponent {
  private [marker]: never
}

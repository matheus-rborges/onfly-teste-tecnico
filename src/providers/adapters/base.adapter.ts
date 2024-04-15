export abstract class BaseAdapter<Input, Output> {
    constructor(protected readonly input: Input) {}

    abstract parse(): Output;
}

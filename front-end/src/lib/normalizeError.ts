import { BaseError, ContractFunctionRevertedError } from "viem";

export function normalizeError(err: unknown): Error {
  if (err instanceof BaseError) {
    const reverted = err.walk(
      (e) => e instanceof ContractFunctionRevertedError
    );

    if (reverted instanceof ContractFunctionRevertedError) {
      return new Error(
        reverted.reason ||
        reverted.shortMessage ||
        "Transaction reverted"
      );
    }

    return new Error(err.shortMessage || "Blockchain error occurred");
  }

  if (err instanceof Error) {
    return err;
  }

  return new Error("Unknown error");
}


import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import DeleteConfirmation from "../pages/DeleteConfirmation";

describe("DeleteConfirmation", () => {
  it("displays the product name in the confirmation message", () => {
    render(
      <DeleteConfirmation
        productName="Gold Ring"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText(/Gold Ring/)).toBeInTheDocument();
  });

  it("calls onCancel when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();

    render(
      <DeleteConfirmation
        productName="Gold Ring"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onConfirm when Confirm delete is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <DeleteConfirmation
        productName="Gold Ring"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /confirm delete/i })
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });
});

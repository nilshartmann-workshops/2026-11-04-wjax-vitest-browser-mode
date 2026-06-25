import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { createOffer } from "#/api/create-offer.ts";
import { getOffersByPostIdQueryOptions } from "#/lib/queryOptions";
import type { CreateOfferInput } from "#/types.ts";
import { CreateOfferSchema } from "#/types.ts";

type OfferFormProps = {
  postId: string;
};

export function OfferForm({ postId }: OfferFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    resolver: standardSchemaResolver(CreateOfferSchema),
  });

  const offerMutation = useMutation({
    mutationFn: (input: CreateOfferInput) => createOffer(postId, input),
    onSuccess: (_data, _vars, _result, context) => {
      reset();
      return context.client.invalidateQueries({
        queryKey: getOffersByPostIdQueryOptions(postId).queryKey,
      });
    },
  });

  const isPending = offerMutation.isPending;

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform);
  const shortcutHint = isMac ? "⌘↵" : "Strg+↵";

  const onSubmit = (data: CreateOfferInput) => offerMutation.mutate(data);

  return (
    <div className="offer-form-wrap">
      <h3 className="offer-form-title">Dein Hilfsangebot</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isPending) {
            handleSubmit(onSubmit)();
          }
        }}
        className="form-stack"
      >
        <div>
          <label htmlFor="offer-author" className="form-label">
            Dein Benutzername
          </label>
          <input
            id="offer-author"
            placeholder="Dein Name"
            className={twMerge("form-input", errors.author && "error")}
            {...register("author")}
          />
          {errors.author && (
            <p className="form-error">{errors.author.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="offer-text" className="form-label">
            Dein Hilfsangebot
          </label>
          <textarea
            id="offer-text"
            placeholder="Erzähl kurz, warum du die richtige Person bist…"
            rows={3}
            className={twMerge(
              "form-input form-textarea",
              errors.text && "error",
            )}
            {...register("text")}
          />
          {errors.text && <p className="form-error">{errors.text.message}</p>}
        </div>
        {offerMutation.isError && (
          <p className="form-error">
            Dein Hilfsangebot konnte nicht gesendet werden. Bitte versuche es
            erneut.
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="btn-offer-submit"
          >
            {isPending ? (
              "Wird gesendet..."
            ) : (
              <>
                Hilfsangebot abschicken
                <span className="ml-2 text-xs opacity-50" aria-hidden="true">
                  {shortcutHint}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

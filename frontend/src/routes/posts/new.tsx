"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import { CATEGORY_CONFIGS } from "#/config/category-config.ts";
import type { CreatePostInput } from "#/types.ts";
import { CreatePostSchema, PostSchema } from "#/types.ts";

const BASE_URL = "http://localhost:7400";

async function createPost(input: CreatePostInput) {
  const res = await fetch(`${BASE_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await res.json();
  return PostSchema.parse(body);
}

export const Route = createFileRoute("/posts/new")({
  component: NewPostPage,
});

function NewPostPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: standardSchemaResolver(CreatePostSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: CreatePostInput) => createPost(data),
    onSuccess: (_data, _vars, _result, context) => {
      context.client.invalidateQueries({ queryKey: ["posts", "list"] });
      navigate({ to: "/posts", search: {} });
    },
  });

  return (
    <div
      className="page-wrapper-sm"
      style={{ paddingTop: 40, paddingBottom: 40 }}
    >
      <Link to="/" className="back-link">
        ← Zurück
      </Link>

      <h1 className="page-title">Gesuch einstellen</h1>
      <p style={{ color: "#6b5744", marginBottom: 36 }}>
        Beschreib uns dein Tier und wann du Hilfe brauchst — die Community
        hilft!
      </p>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="form-stack-lg"
      >
        <FormField
          name="title"
          label="Titel"
          placeholder="z.B. Wer kümmert sich um meine Schildkröten?"
          register={register}
          errors={errors}
        />
        <FormField
          name="author"
          label="Dein Benutzername"
          placeholder="z.B. felix.node"
          register={register}
          errors={errors}
        />
        <FormField
          name="animal"
          label="Tier / Pflanze"
          placeholder="z.B. 2 Landschildkröten, sehr eigenständig"
          register={register}
          errors={errors}
        />
        <FormField
          name="timeframe"
          label="Zeitraum"
          placeholder="z.B. 3 Wochen im Juli"
          register={register}
          errors={errors}
        />
        <FormField
          name="location"
          label="Ort"
          placeholder="z.B. Hamburg-Altona"
          register={register}
          errors={errors}
        />

        <div>
          <label className="form-label">Kategorie</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {CATEGORY_CONFIGS.map((cat) => (
                  <label
                    key={cat.id}
                    className={twMerge(
                      "category-radio-label",
                      `category-${cat.id}`,
                      field.value === cat.id && "selected",
                    )}
                    style={{
                      borderColor:
                        field.value === cat.id ? cat.color : "#f5ede0",
                    }}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={field.value === cat.id}
                      onChange={() => field.onChange(cat.id)}
                      style={{ display: "none" }}
                    />
                    {cat.emoji} {cat.label}
                  </label>
                ))}
              </div>
            )}
          />
          {errors.category && (
            <p className="form-error">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Beschreibung</label>
          <textarea
            placeholder="Erzähl uns mehr über dein Tier und was ihr braucht…"
            rows={4}
            className={twMerge(
              "form-input form-textarea-lg",
              errors.description && "error",
            )}
            {...register("description")}
          />
          {errors.description && (
            <p className="form-error">{errors.description.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className={twMerge("btn-submit", mutation.isSuccess && "success")}
        >
          {mutation.isSuccess
            ? "✓ Gesuch veröffentlicht!"
            : mutation.isPending
              ? "Wird gespeichert…"
              : "Gesuch veröffentlichen →"}
        </button>
      </form>
    </div>
  );
}

type TextFieldName = Exclude<keyof CreatePostInput, "category" | "description">;

type FormFieldProps = {
  name: TextFieldName;
  label: string;
  placeholder: string;
  register: UseFormRegister<CreatePostInput>;
  errors: FieldErrors<CreatePostInput>;
};

function FormField({
  name,
  label,
  placeholder,
  register,
  errors,
}: FormFieldProps) {
  const error = errors[name];
  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className={twMerge("form-input", error && "error")}
        {...register(name)}
      />
      {error && <p className="form-error">{error.message}</p>}
    </div>
  );
}

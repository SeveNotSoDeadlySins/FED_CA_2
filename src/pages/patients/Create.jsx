import { useAuth } from "@/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "@/config/api";
import { useNavigate } from "react-router";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CreatePatient() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Validation schema
  const formSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters").max(255, "First name too long"),
    last_name: z.string().min(2, "Last name must be at least 2 characters").max(255, "Last name too long"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
    address: z.string().min(1, "Address is required"),
    date_of_birth: z.string().min(1, "Date of birth is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      date_of_birth: "",
    },
    mode: "onChange",
  });

  const submitForm = async (data) => {
    try {
      const response = await axios.post("/patients", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`Patient "${response.data.first_name} ${response.data.last_name}" created successfully`);
      navigate("/patients");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create patient");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <Toaster />
      <CardHeader>
        <CardTitle>Create Patient</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(submitForm)}>
          <div className="flex flex-col gap-4">
            <Controller
              name="first_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>First Name</FieldLabel>
                  <Input {...field} placeholder="First Name" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input {...field} placeholder="Last Name" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...field} placeholder="Email" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Phone</FieldLabel>
                  <Input {...field} placeholder="Phone" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Address</FieldLabel>
                  <Input {...field} placeholder="Address" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="date_of_birth"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input {...field} placeholder="DD/MM/YYYY" />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <div className="mt-4">
            <Button type="submit" variant="outline" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const formSchema = z.object({
    appointment_date: z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format"),
    doctor_id: z.string().regex(/^\d+$/, "Doctor ID must be a number"),
    patient_id: z.string().regex(/^\d+$/, "Patient ID must be a number"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appointment_date: "",
      doctor_id: "",
      patient_id: "",
    },
    mode: "onChange", // validate while typing
  });

  const submitForm = async (data) => {
    try {
      const response = await axios.post(
        "/appointments",
        {
          appointment_date: data.appointment_date,
          doctor_id: parseInt(data.doctor_id),
          patient_id: parseInt(data.patient_id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        `Appointment "${response.data.appointment_date}" created successfully`
      );
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create appointment");
    }
  };

return (
    <Card className="w-full max-w-md">
      <Toaster />
      <CardHeader>
        <CardTitle>Create Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(submitForm)}>
          <div className="flex flex-col gap-4">
            <Controller
              name="appointment_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Appointment Date</FieldLabel>
                  <Input {...field} placeholder="DD/MM/YYYY" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="doctor_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Doctor ID</FieldLabel>
                  <Input {...field} placeholder="Doctor Number" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="patient_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Patient ID</FieldLabel>
                  <Input {...field} placeholder="Patient Number" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
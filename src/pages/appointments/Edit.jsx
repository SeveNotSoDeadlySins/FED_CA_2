import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import FormCard from "@/components/formcard";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { formatDateDMY } from "@/components/DateFormat";

export default function EditAppointment() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();

  // Zod schema
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
    mode: "onChange",
  });

  // Fetch appointment data
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        form.reset({
          appointment_date: formatDateDMY(response.data.appointment_date),
          doctor_id: String(response.data.doctor_id),
          patient_id: String(response.data.patient_id),
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load appointment");
      }
    };

    fetchAppointment();
  }, [id, token]);

  // Submit handler
  const submitForm = async (data) => {
    try {
      const response = await axios.patch(
        `/appointments/${id}`,
        {
          appointment_date: data.appointment_date,
          doctor_id: parseInt(data.doctor_id),
          patient_id: parseInt(data.patient_id),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        `Appointment "${response.data.appointment_date}" updated successfully`
      );
      navigate("/appointments");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update appointment");
    }
  };

  return (
    <>
      <Toaster />
      <FormCard
        title="Edit Appointment"
        onSubmit={form.handleSubmit(submitForm)}
        submitText="Save Appointment"
      >
        <Controller
          name="appointment_date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Appointment Date</FieldLabel>
              <Input {...field} placeholder="DD/MM/YYYY" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FormCard>
    </>
  );
}

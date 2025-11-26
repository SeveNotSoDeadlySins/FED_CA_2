import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "@/config/api";
import { useState } from "react";

export default function DeleteBtn({ resource, id, onDeleteCallback }) {
  const [isDeleting, setIsDeleting] = useState(false);

  let token = localStorage.getItem("token");


  const onDelete = async () => {
    const options = {
      method: "GET",
      url: `/${resource}/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      let response = await axios.request(options);
      console.log(response.data);
      if (onDeleteCallback) {
        onDeleteCallback(id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return !isDeleting ? (
    <Button
      className="cursor-pointer hover:bg-red-500"
      variant="outline"
      size="icon"
      onClick={() => setIsDeleting(true)}
    >
      <Trash />
    </Button>
  ) : (
    <>
      <p>Are you sure?</p>
      <Button
        onClick = {onDelete}
        variant="outline"
        size="sm"
        className="text-red-500 border-red-500 hover:border-red-500 hover:bg-red-500"
      > Yes</Button>
      <Button
        onClick = {() => setIsDeleting(false)}
        variant="outline"
        size="sm"
        className="text-slate-500 border-slate-500 hover:border-slate-500 hover:bg-slate-500"
      > No</Button>
    </>
  );
}

import { register } from "../services/authService";

const CreateAdmin = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
  });

  const handleCreate = async () => {
    try {
      await register({
        ...form,
        roles: ["ADMIN"],
      });
      alert("Admin created successfully");
    } catch {
      alert("Failed to create admin");
    }
  };

  return (
    <div className="max-w-md p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Create Admin</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key}
          className="w-full mb-3 px-3 py-2 border rounded"
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
        />
      ))}

      <button
        onClick={handleCreate}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Create Admin
      </button>
    </div>
  );
};

export default CreateAdmin;

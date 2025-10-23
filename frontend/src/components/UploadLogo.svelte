<script>
  let file = null;
  let message = "";
  let uploadedUrl = "";

  async function handleUpload() {
    if (!file) {
      message = "Моля, избери файл!";
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      message = "⚠️ Първо влез в системата";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        uploadedUrl = data.fileUrl;
        message = "✅ Успешно качване";
      } else {
        message = "❌ " + data.error;
      }
    } catch (err) {
      message = "⚠️ Грешка при свързване със сървъра";
    }
  }
</script>

<div class="p-4 max-w-sm mx-auto space-y-4">
  <h2 class="text-xl font-bold text-center">Качване на лого</h2>

  <input type="file" accept="image/*" on:change={(e) => file = e.target.files[0]} class="w-full" />

  <button on:click={handleUpload} class="bg-green-600 text-white w-full p-2 rounded">
    Качи
  </button>

  {#if message}
    <p class="text-center text-sm text-gray-600">{message}</p>
  {/if}

  {#if uploadedUrl}
    <img src={uploadedUrl} alt="Logo" class="w-32 mx-auto mt-2 rounded shadow" />
  {/if}
</div>

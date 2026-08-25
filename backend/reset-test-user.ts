import bcrypt from "bcrypt";
import prisma from "./src/config/prisma";

async function resetPassword() {
  const newPassword = "TestUser123!";

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  const user = await prisma.user.update({
    where: {
      id: 6,
    },
    data: {
      password: hashedPassword,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
  });

  console.log("Password reset successfully:");
  console.log(user);
  console.log("New password:", newPassword);
}

resetPassword()
  .catch((error) => {
    console.error("Password reset failed:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
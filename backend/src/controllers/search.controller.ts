import { Request, Response } from "express";
import { searchUsers } from "../services/search.service";

export async function searchUser(req: Request, res: Response) {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await searchUsers(query);

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Search failed",
    });
  }
}
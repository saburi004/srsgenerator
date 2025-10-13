// //srs/room/[roomId]/route.js

// import connectDB from "@/lib/dbconfig";
// import SrsDocument from "@/models/srs";
// import Room from "@/models/room";
// import User from "@/models/user";

// // GET - Get all SRS documents for a specific room
// export async function GET(request, { params }) {
//   await connectDB();

//   try {
//     const { roomId } = params;
    
//     console.log("GET SRS for Room ID:", roomId);
    
//     if (!roomId) {
//       return Response.json({ 
//         success: false, 
//         error: "Room ID is required" 
//       }, { status: 400 });
//     }

//     // Find the room first
//     const room = await Room.findOne({ roomId });
//     console.log("Found room:", room ? room.roomId : "Not found");
    
//     if (!room) {
//       return Response.json({ 
//         success: false, 
//         error: "Room not found" 
//       }, { status: 404 });
//     }

//     // Get SRS documents for this room WITHOUT nested population
//     const srsDocuments = await SrsDocument.find({ room: room._id })
//       .sort({ createdAt: -1 });

//     console.log("Found SRS documents:", srsDocuments.length);

//     // Build response with author information
//     const documentsWithAuthors = await Promise.all(
//       srsDocuments.map(async (doc) => {
//         const docObj = doc.toObject();
        
//         // Get createdBy user info
//         const createdByUser = await User.findById(docObj.createdBy).select('name email');
        
//         // Get author info for each version
//         const versionsWithAuthors = await Promise.all(
//           docObj.versions.map(async (version) => {
//             const author = await User.findById(version.author).select('name email');
//             return {
//               ...version,
//               author: {
//                 name: author?.name || 'Unknown',
//                 email: author?.email || ''
//               }
//             };
//           })
//         );
        
//         return {
//           ...docObj,
//           versions: versionsWithAuthors,
//           createdBy: {
//             name: createdByUser?.name || 'Unknown',
//             email: createdByUser?.email || ''
//           }
//         };
//       })
//     );

//     return Response.json({ 
//       success: true, 
//       srsDocuments: documentsWithAuthors 
//     });

//   } catch (error) {
//     console.error("GET SRS Error Details:", error);
//     return Response.json({ 
//       success: false, 
//       error: error.message
//     }, { status: 500 });
//   }
// }


// app/api/srs/room/[roomId]/route.js
import connectDB from "@/lib/dbconfig";
import SrsDocument from "@/models/srs";
import Room from "@/models/room";
import User from "@/models/user";
import { NextResponse } from "next/server";

// GET - Get all SRS documents for a specific room
export async function GET(request, { params }) {
  await connectDB();

  try {
    const { roomId } = params;
    
    console.log("GET SRS for Room ID:", roomId);
    
    if (!roomId) {
      return NextResponse.json({ 
        success: false, 
        error: "Room ID is required" 
      }, { status: 400 });
    }

    // Find the room first
    const room = await Room.findOne({ roomId });
    console.log("Found room:", room ? room.roomId : "Not found");
    
    if (!room) {
      return NextResponse.json({ 
        success: false, 
        error: "Room not found" 
      }, { status: 404 });
    }

    // Get SRS documents for this room WITHOUT nested population
    const srsDocuments = await SrsDocument.find({ room: room._id })
      .sort({ createdAt: -1 });

    console.log("Found SRS documents:", srsDocuments.length);

    // Build response with author information
    const documentsWithAuthors = await Promise.all(
      srsDocuments.map(async (doc) => {
        const docObj = doc.toObject();
        
        // Get createdBy user info
        const createdByUser = await User.findById(docObj.createdBy).select('name email');
        
        // Get author info for each version
        const versionsWithAuthors = await Promise.all(
          docObj.versions.map(async (version) => {
            const author = await User.findById(version.author).select('name email');
            return {
              ...version,
              author: {
                name: author?.name || 'Unknown',
                email: author?.email || ''
              }
            };
          })
        );
        
        return {
          ...docObj,
          versions: versionsWithAuthors,
          createdBy: {
            name: createdByUser?.name || 'Unknown',
            email: createdByUser?.email || ''
          }
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      srsDocuments: documentsWithAuthors 
    });

  } catch (error) {
    console.error("GET SRS Error Details:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message
    }, { status: 500 });
  }
}
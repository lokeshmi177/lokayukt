<?php

namespace App\Http\Controllers\api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\ComplainType;
use App\Models\Department;
use App\Models\Designation;
use App\Models\District;
use App\Models\RejectionReasons;
use App\Models\Subjects;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommonController extends Controller
{
    public function fetch_district(){

        $district=District::get();
        // dd($district->toArray());
        return ApiResponse::generateResponse('success','District fetch successfully',$district);
    }
    public function fetch_designation(){

        $designation = Designation::get();
        // dd($designation->toArray());
        return ApiResponse::generateResponse('success','Designation fetch successfully',$designation);
    }
       public function fetch_department(){

        $department = Department::get();
        // dd($designation->toArray());
        return ApiResponse::generateResponse('success','Department fetch successfully',$department);
    }
    public function fetch_subject(){

        $designation = Subjects::get();
        // dd($designation->toArray());
        return ApiResponse::generateResponse('success','Subject fetch successfully',$designation);
    }
    
    public function fetch_complainstype(){

        $designation = ComplainType::get();
        // dd($designation->toArray());
        return ApiResponse::generateResponse('success','Complain Type fetch successfully',$designation);
    }
    public function fetch_rejection(){

        $designation = RejectionReasons::get();
        // dd($designation->toArray());
        return ApiResponse::generateResponse('success','Rejection Reasons fetch successfully',$designation);
    }

       public function addDepartment(Request $request)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_hindi' => 'string|max:150',
         
          
        ], [
            'name.required' => 'Name is required.',
            // 'name_h.required' => 'Name is required.',
            // 'status.digits' => 'Status must be a digit.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $department = new Department();
        $department->name = $request->name;
        $department->name_hindi= $request->name_hindi;
        $department->status = $request->status;
    
        $department->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Department added successfully.',
            'data' => $department
        ], 201);
    }
     public function editDepartment(Request $request,$id)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'string|max:150',
         
          
        ], [
            'name.required' => 'Name is required.',
            // 'name_hindi.required' => 'Name is required.',
            // 'status.digits' => 'Status must be a digit.',
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $department = Department::find($id);

         if(!$department){
            return response()->json([
                'status' => false,
                'message' => 'Invalid department ID.'
            ], 400);

        }

        $department->name = $request->name;
        $department->name_hindi = $request->name_hindi;
        $department->status = $request->status;
    
        $department->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Department update successfully.',
            'data' => $department
        ], 200);
    }


     public function addDesignation(Request $request)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'string|max:150',
         
          
        ], [
            'name.required' => 'Name is required.',
            // 'name_h.required' => 'Name is required.',
            // 'status.digits' => 'Status must be a digit.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $designation = new Designation();
        $designation->name = $request->name;
        $designation->name_h = $request->name_h;
        $designation->status = $request->status;
    
        $designation->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Designation added successfully.',
            'data' => $designation
        ], 201);
    }
     public function editDesignation(Request $request,$id)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'string|max:150',
         
          
        ], [
            'name.required' => 'Name is required.',
            // 'name_h.required' => 'Name is required.',
            // 'status.digits' => 'Status must be a digit.',
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $designation = Designation::find($id);

         if(!$designation){
            return response()->json([
                'status' => false,
                'message' => 'Invalid designation ID.'
            ], 400);

        }

        $designation->name = $request->name;
        $designation->name_h = $request->name_h;
        $designation->status = $request->status;
    
        $designation->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Designation update successfully.',
            'data' => $designation
        ], 200);
    }

        public function addSubject(Request $request)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'string|max:150',
         
          
        ], [
            'name.required' => 'Name is required.',
            // 'name_h.required' => 'Name is required.',
            // 'status.digits' => 'Status must be a digit.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $subject = new Subjects();
        $subject->name = $request->name;
        $subject->name_h = $request->name_h;
        $subject->status = $request->status;
    
        $subject->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Subject added successfully.',
            'data' => $subject
        ], 201);
    }
     public function editSubject(Request $request,$id)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'string|max:150',
         
          
        ], [
            'name.required' => 'Name is required.',
            // 'name_h.required' => 'Name is required.',
            // 'status.digits' => 'Status must be a digit.',
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $subject = Subjects::find($id);

         if(!$subject){
            return response()->json([
                'status' => false,
                'message' => 'Invalid designation ID.'
            ], 400);

        }

        $subject->name = $request->name;
        $subject->name_h = $request->name_h;
        $subject->status = $request->status;
    
        $subject->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Subject update successfully.',
            'data' => $subject
        ], 200);
    }

        public function addComplainType(Request $request)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'string|max:150',
            'description' => 'required|string|max:500',
         
          
        ], [
            'name.required' => 'Name is required.',
            'name.description' => 'Description is required.',
            // 'name_h.required' => 'Name is required.',
            // 'status.digits' => 'Status must be a digit.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $complainType = new ComplainType();
        $complainType->name = $request->name;
        $complainType->name_h = $request->name_h;
        $complainType->status = $request->status;
        $complainType->description = $request->description;
    
        $complainType->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'ComplainType added successfully.',
            'data' => $complainType
        ], 201);
    }
     public function editComplainType(Request $request,$id)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'string|max:150',
            'description' => 'required|string|max:500',
         
          
        ], [
            'name.required' => 'Name is required.',
            'discription.required' => 'Discription is required.',
            // 'name_h.required' => 'Name is required.',
            // 'status.digits' => 'Status must be a digit.',
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $complaintype = ComplainType::find($id);

         if(!$complaintype){
            return response()->json([
                'status' => false,
                'message' => 'Invalid designation ID.'
            ], 400);

        }

        $complaintype->name = $request->name;
        $complaintype->name_h = $request->name_h;
        $complaintype->status = $request->status;
        $complaintype->description = $request->description;
    
        $complaintype->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'ComplainType update successfully.',
            'data' => $complaintype
        ], 200);
    }

         public function addRejection(Request $request)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'string|max:150',
            'description' => 'required|string|max:500',
         
          
        ], [
            'name.required' => 'Name is required.',
            'name.description' => 'Description is required.',
            // 'name_h.required' => 'Name is required.',
            // 'status.digits' => 'Status must be a digit.',
           
        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $rejection = new RejectionReasons();
        $rejection->name = $request->name;
        $rejection->name_h = $request->name_h;
        $rejection->status = $request->status;
        $rejection->description = $request->description;
    
        $rejection->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Rejection Reason added successfully.',
            'data' => $rejection
        ], 201);
    }
     public function editRejection(Request $request,$id)
    {
        // dd($request->all());
        $validation = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'name_h' => 'string|max:150',
            'description' => 'required|string|max:500',
         
          
        ], [
            'name.required' => 'Name is required.',
            'discription.required' => 'Discription is required.',
            // 'name_h.required' => 'Name is required.',
            // 'status.digits' => 'Status must be a digit.',
           
        ]);

       

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        $rejectionReason = RejectionReasons::find($id);

         if(!$rejectionReason){
            return response()->json([
                'status' => false,
                'message' => 'Invalid designation ID.'
            ], 400);

        }

        $rejectionReason->name = $request->name;
        $rejectionReason->name_h = $request->name_h;
        $rejectionReason->status = $request->status;
        $rejectionReason->description = $request->description;
    
        $rejectionReason->save(); // ✅ Insert into DB

        return response()->json([
            'status' => true,
            'message' => 'Rejection Reason update successfully.',
            'data' => $rejectionReason
        ], 200);
    }
}

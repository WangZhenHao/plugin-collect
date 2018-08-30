<?php
$arrList = ['red', 'green', 'yellow', 'pink'];
// $arr = [
// 	'name' => $_GET['name'], 
// 	'age' => $_GET['age'], 
// 	'address' => $_GET['address'], 
// 	'list' => $arrList,

// ];
$arr = [
	'name' =>'wzh', 
	'age' => 14, 
	'address' => '设置', 
	'list' => $arrList,
	
];
echo json_encode($arr);

?>
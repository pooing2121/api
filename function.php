<?php

if (!isset($_SESSION)) {
    session_start();
}

include 'dbcon.php';



$_SESSION['click_win'] = $_GET['click'];


$sql_credit = $sqlite->prepare("SELECT * FROM users WHERE id=:id");
$sql_credit->execute(array('id' => $_SESSION['baccarat']['id']));
$rs_credit = $sql_credit->fetch(PDO::FETCH_ASSOC);


if ($rs_credit['credit'] == 0) {
    echo '{          
              "credit":"0"
     }';
} else {
    $click = $_GET['click'];

    if ($_POST['data'] == 'resetHistory') {

        $h_win = $_SESSION['h_win'];
        $h_lose = $_SESSION['h_lose'];
        if ($h_win == '') {
            $h_win = '0';
        }
        if ($h_lose == '') {
            $h_lose = '0';
        }

        $sql_history = $sqlite->prepare("UPDATE  statistic set 
            status=:status
            WHERE user=:user AND status='1'
            ");
        $sql_history->execute(array(
            ':status' => '0',
            ':user' => $_SESSION['baccarat']['id']
        ));
        if ($sql_history) {
            $sql_statistic_all = "INSERT INTO statistic_all(
        user,
        win,
        lose,
        date
        )VALUES(
        :user,
        :win,
        :lose,
        :date
        )";
            $result_statistic_all = $sqlite->prepare($sql_statistic_all);
            $result_statistic_all->execute(array(
                ':user' => $_SESSION['baccarat']['id'],
                ':win' => $h_win,
                ':lose' => $h_lose,
                ':date' => date('Y-m-d')
            ));

            unset($_SESSION['h_win']);
            unset($_SESSION['h_lose']);
            unset($_SESSION['click']);
            unset($_SESSION['point']);
            unset($_SESSION['clickCount']);
            unset($_SESSION['clickWin']);
        }
    }

  


    if ($_POST['data'] == 'resetTable') {
        unset($_SESSION['click']);
        unset($_SESSION['point']);
        unset($_SESSION['clickCount']);
        unset($_SESSION['clickWin']);
        unset($_SESSION['result']);
    }

//แพ้
    if (empty($_SESSION['click'])) {
        $clickUpdate = $click;
        $_SESSION['click'] = $clickUpdate;
    } else {
        $clickUpdate = $_SESSION['click'] . $click;
        $_SESSION['click'] = $clickUpdate;
    }

    
    
   if ($_POST['data'] == 'undoBall') {
        $undo = substr($_SESSION['click'], 0, -1);
        $_SESSION['click'] = $undo;
    }
    
    
    

//เช็คสูตร
//ตัดเอาแค่ 4
    if (strlen($_SESSION['click']) > 4) {
        $click_new = substr($_SESSION['click'], 1, 4);
        $_SESSION['click'] = $click_new;
    }

//น้ำเงิน
    if ($_SESSION['click'] == 'PPPP') {
        $point = 'P';
    } elseif ($_SESSION['click'] == 'PPPB') {
        $point = 'P';
    } elseif ($_SESSION['click'] == 'PPBB') {
        $point = 'P';
    } elseif ($_SESSION['click'] == 'PPBP') {
        $point = 'P';
    } elseif ($_SESSION['click'] == 'PBPB') {
        $point = 'P';
    } elseif ($_SESSION['click'] == 'PBBB') {
        $point = 'P';
    } elseif ($_SESSION['click'] == 'PPBP') {
        $point = 'P';
    } elseif ($_SESSION['click'] == 'PBBP') {
        $point = 'P';
    }

//แดง
    if ($_SESSION['click'] == 'BBBB') {
        $point = 'B';
    } elseif ($_SESSION['click'] == 'BBBP') {
        $point = 'B';
    } elseif ($_SESSION['click'] == 'BBPP') {
        $point = 'B';
    } elseif ($_SESSION['click'] == 'BPBB') {
        $point = 'B';
    } elseif ($_SESSION['click'] == 'BPBP') {
        $point = 'B';
    } elseif ($_SESSION['click'] == 'BPPP') {
        $point = 'B';
    } elseif ($_SESSION['click'] == 'BPPB') {
        $point = 'B';
    }








//    echo $_SESSION['click'];





    if (!empty($point)) {
//WIN
        if ($click == $_SESSION['point']) {
            $result = 'WIN';
            $sql_statistic = "INSERT INTO statistic(
        user,
        date,
        count,
        ball,
        result,
        status
        )VALUES(
        :user,
        :date,
        :count,
        :ball,
        :result,
        :status
        )";
            $result_statistic = $sqlite->prepare($sql_statistic);
            $result_statistic->execute(array(
                ':user' => $_SESSION['baccarat']['id'],
                ':date' => date('Y-m-d'),
                ':count' => $_SESSION['clickWin'],
                ':ball' => $_SESSION['click'],
                ':result' => $result,
                ':status' => '1'
            ));

            $sql_last_login = "UPDATE  users SET credit=credit-:credit WHERE id=:id";
            $result_last_login = $sqlite->prepare($sql_last_login);
            $result_last_login->execute(array(
                'credit' => 1,
                'id' => $_SESSION['baccarat']['id']
            ));


            $_SESSION['clickWin'] = 1;
//LOSE
        } else {
            if (!isset($_SESSION['clickWin'])) {
                $clickWin = 1;
                $_SESSION['clickWin'] = $clickWin;
            } else {
                $clickWin = $_SESSION['clickWin'] + 1;
                $_SESSION['clickWin'] = $clickWin;
            }

            if ($_SESSION['clickWin'] > 3) {
                $result = 'LOSE';
                $sql_statistic = "INSERT INTO statistic(
                user,
                date,
                count,
                ball,
                result,
                status
                )VALUES(
                :user,
                :date,
                :count,
                :ball,
                :result,
                :status
            )";
                $result_statistic = $sqlite->prepare($sql_statistic);
                $result_statistic->execute(array(
                    ':user' => $_SESSION['baccarat']['id'],
                    ':date' => date('Y-m-d'),
                    ':count' => $_SESSION['clickWin'],
                    ':ball' => $_SESSION['click'],
                    ':result' => $result,
                    'status' => '1'
                ));
                $_SESSION['clickWin'] = 1;
            }
        }
    } else {
        //WIN
        if ($click == $_SESSION['point']) {
            $result = 'WIN';

            $sql_statistic = "INSERT INTO statistic(
        user,
        date,
        count,
        ball,
        result,
        status
        )VALUES(
        :user,
        :date,
        :count,
        :ball,
        :result,
        :status
        )";
            $result_statistic = $sqlite->prepare($sql_statistic);
            $result_statistic->execute(array(
                ':user' => $_SESSION['baccarat']['id'],
                ':date' => date('Y-m-d'),
                ':count' => $_SESSION['clickWin'],
                ':ball' => $_SESSION['click'],
                ':result' => $result,
                ':status' => '1'
            ));

            $sql_last_login = "UPDATE  users SET credit=credit-:credit WHERE id=:id";
            $result_last_login = $sqlite->prepare($sql_last_login);
            $result_last_login->execute(array(
                'credit' => 1,
                'id' => $_SESSION['baccarat']['id']
            ));

            unset($_SESSION['clickWin']);
//LOSE
        } else {

            if ($_SESSION['clickWin'] == 3) {
                $result = 'LOSE';
                $sql_statistic = "INSERT INTO statistic(
                user,
                date,
                count,
                ball,
                result,
                status
                )VALUES(
                :user,
                :date,
                :ball,
                :count,
                :result,
                :status
               )";
                $result_statistic = $sqlite->prepare($sql_statistic);
                $result_statistic->execute(array(
                    ':user' => $_SESSION['baccarat']['id'],
                    ':date' => date('Y-m-d'),
                    ':ball' => $_SESSION['click'],
                    ':count' => $_SESSION['clickWin'],
                    ':result' => $result,
                    ':status' => '1'
                ));

                unset($_SESSION['clickWin']);
            }
        }
    }

 

    $_SESSION['result'] = $result;
    $_SESSION['point'] = $point;

//ไม้ที่เข้าสูตร $clickWin

    echo '{
            "clickWin":"' . $_SESSION['clickWin'] . '",
            "point":"' . $_SESSION['point'] . '",            
            "result":"' . $_SESSION['result'] . '"
           
     }';
}
